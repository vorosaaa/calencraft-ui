import {
  DataGrid,
  GridCallbackDetails,
  GridColDef,
  GridEventListener,
  GridPaginationModel,
  GridRenderCellParams,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { Avatar, LinearProgress } from "@mui/material";
import { UserProfile } from "../../types/user";
import { useTranslation } from "react-i18next";
import { useCheckMobileScreen } from "../../hooks/screenHook";
import { useMemo } from "react";

interface ProviderTableProps {
  providers: UserProfile[];
  total: number;
  isLoading: boolean;
  paginationModel: GridPaginationModel;
  onPaginationChange: (
    model: GridPaginationModel,
    details: GridCallbackDetails,
  ) => void;
}

const columns: GridColDef[] = [
  {
    field: "avatar", // Add a new field for avatar
    headerName: "", // Column header
    sortable: false,
    filterable: false,
    hideable: false,
    width: 70,
    renderCell: (params: GridRenderCellParams) => (
      <Avatar
        alt={`${params.row.name} ${params.row.lastName}`}
        src={params.row.picUrl}
      />
    ),
  },
  { field: "name", headerName: "search.table.name", flex: 1 },
  { field: "description", headerName: "search.table.description", flex: 3 },
  { field: "type", headerName: "search.table.type", flex: 1 },
  { field: "address", headerName: "search.table.address", flex: 1 },
];

export const ProviderTable = ({
  providers,
  total,
  isLoading,
  paginationModel,
  onPaginationChange,
}: ProviderTableProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isMobile = useCheckMobileScreen();

  const handleRowClick: GridEventListener<"rowClick"> = (params) => {
    navigate(`/profile/${params.row.slug || params.row.id}`);
  };
  const translatedColumns = useMemo(() => {
    return columns
      .filter((column) => !isMobile || column.field !== "description")
      .map((column, index) => ({
        ...column,
        valueGetter: (params: GridValueGetterParams) =>
          column.field === "type"
            ? t(`service_types.${params.row.type}`)
            : column.field === "address"
              ? params.row.address?.city
              : params.value,
        headerName: index === 0 ? "" : t(`${column.headerName}`),
      }));
  }, [isMobile, t]);

  return (
    <DataGrid
      loading={isLoading}
      rows={providers}
      autoHeight
      columns={translatedColumns}
      paginationMode="server"
      filterMode="server"
      rowCount={total}
      pageSizeOptions={[5, 10, 20]}
      slots={{
        loadingOverlay: LinearProgress,
      }}
      onRowClick={handleRowClick}
      rowSelection={false}
      paginationModel={paginationModel}
      onPaginationModelChange={onPaginationChange}
    />
  );
};
