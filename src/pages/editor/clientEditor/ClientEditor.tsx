import { useMutation, useQuery, useQueryClient } from "react-query";
import { blockClient, getClients, unblockClient } from "../../../api/meApi";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Avatar,
  Button,
  Container,
  LinearProgress,
  Typography,
  CircularProgress,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import {
  DataGrid,
  GridColDef,
  GridEventListener,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { enqueueError, enqueueSuccess } from "../../../enqueueHelper";
import { Lock, LockOpen } from "@mui/icons-material";
import "./ClientEditor.css"; // Import the CSS file

export const ClientEditor = () => {
  //Hooks
  const navigate = useNavigate();
  const { t } = useTranslation();
  const client = useQueryClient();
  const [isBlockOpen, setIsBlockOpen] = useState(false);
  const [isUnblockOpen, setIsUnblockOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [selectedClientName, setSelectedClientName] = useState<string | null>(
    null,
  );

  //Queries and mutations
  const { data, isLoading } = useQuery("client", getClients, {
    staleTime: 60000,
  });
  const { mutate: block, isLoading: isBlockLoading } = useMutation(
    blockClient,
    {
      onError: (error: any) => {
        client.invalidateQueries("client");
        enqueueError(t(`messages.errors.${error.response.data.message}`));
        setIsBlockOpen(false);
        setSelectedClient(null);
        setSelectedClientName(null);
      },
      onSuccess: (data) => {
        client.invalidateQueries("client");
        setIsBlockOpen(false);
        setSelectedClient(null);
        setSelectedClientName(null);
        if (data.success) {
          enqueueSuccess(t(`messages.success.${data.message}`));
        } else {
          enqueueError(t(`messages.errors.${data.message}`));
        }
      },
    },
  );
  const { mutate: unBlock, isLoading: isUnblockLoading } = useMutation(
    unblockClient,
    {
      onError: (error: any) => {
        client.invalidateQueries("client");
        enqueueError(t(`messages.errors.${error.response.data.message}`));
        setIsUnblockOpen(false);
        setSelectedClient(null);
        setSelectedClientName(null);
      },
      onSuccess: (data) => {
        client.invalidateQueries("client");
        setIsUnblockOpen(false);
        setSelectedClient(null);
        setSelectedClientName(null);
        if (data.success) {
          enqueueSuccess(t(`messages.success.${data.message}`));
        } else {
          enqueueError(t(`messages.errors.${data.message}`));
        }
      },
    },
  );

  //Functions

  const handleRowClick: GridEventListener<"rowClick"> = (params) => {
    navigate(`/profile/${params.row.id}`);
  };
  const handleBlock = () => {
    if (selectedClient) {
      block(selectedClient);
    }
  };
  const handleUnblock = () => {
    if (selectedClient) {
      unBlock(selectedClient);
    }
  };

  //Columns
  const columns = useMemo<GridColDef[]>(
    () => [
      {
        field: "avatar",
        headerName: "",
        sortable: false,
        filterable: false,
        hideable: false,
        disableColumnMenu: true,
        width: 70,
        renderCell: (params: GridRenderCellParams) =>
          params.row.picUrl && (
            <Avatar alt={`${params.row.name}`} src={params.row.picUrl} />
          ),
      },
      {
        field: "name",
        disableColumnMenu: true,
        headerName: t("client.table.name"),
        flex: 1,
      },
      {
        field: "email",
        disableColumnMenu: true,
        headerName: t("client.table.email"),
        flex: 2,
      },
      {
        field: "socials",
        headerName: t("client.table.socials"),
        disableColumnMenu: true,

        flex: 1,
        renderCell: (params: GridRenderCellParams) => {
          if (params.row.socials) {
            const socials = params.row.socials.length
              ? JSON.parse(params.row.socials)
              : null;

            return (
              Array.isArray(socials) &&
              socials !== null && (
                <Box
                  sx={{
                    display: "flex",
                    width: "100%",
                  }}
                >
                  {socials.map((social: any) => {
                    return (
                      <Box
                        key={social.platform}
                        sx={{
                          cursor: "pointer",
                          mr: 2,
                          display: "flex",
                          alignItems: "center",
                        }}
                        onClick={(event) => {
                          event.stopPropagation();
                          window.open(social.link, "_blank");
                        }}
                      >
                        <img
                          src={`https://simpleicons.org/icons/${social.platform.toLowerCase()}.svg`}
                          alt={social.platform}
                          style={{ width: 24, height: 24 }}
                        />
                      </Box>
                    );
                  })}
                </Box>
              )
            );
          }
          return null;
        },
      },
      {
        field: "phoneNumber",
        disableColumnMenu: true,
        headerName: t("client.table.phone"),
        flex: 1,
      },
      {
        field: "isBlocked",
        headerName: "",
        sortable: false,
        filterable: false,
        hideable: false,
        disableColumnMenu: true,
        renderCell: (params: GridRenderCellParams) => (
          <Box
            sx={{ display: "flex", justifyContent: "center", width: "100%" }}
          >
            <Tooltip
              title={
                params.row.isBlocked
                  ? t("client.unblock.confirm")
                  : t("client.block.confirm")
              }
            >
              <IconButton
                color={params.row.isBlocked ? "secondary" : "error"}
                onClick={(event) => {
                  event.stopPropagation();
                  setSelectedClient(params.row.id);
                  setSelectedClientName(params.row.name);
                  if (params.row.isBlocked) {
                    setIsUnblockOpen(true);
                  } else {
                    setIsBlockOpen(true);
                  }
                }}
              >
                {params.row.isBlocked ? <Lock /> : <LockOpen />}
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ],
    [t],
  );

  return (
    <Container sx={{ mt: 4 }}>
      <BlockModal
        name={selectedClientName || ""}
        open={isBlockOpen}
        isLoading={isBlockLoading}
        onClose={() => setIsBlockOpen(false)}
        onConfirm={handleBlock}
      />
      <UnblockModal
        name={selectedClientName || ""}
        open={isUnblockOpen}
        isLoading={isUnblockLoading}
        onClose={() => setIsUnblockOpen(false)}
        onConfirm={handleUnblock}
      />
      <Typography variant="h4" mb={4}>
        {t("client.title")}
      </Typography>

      <DataGrid
        loading={isLoading}
        rows={data?.resultList || []}
        autoHeight
        columns={columns}
        rowCount={data?.size || 0}
        pageSizeOptions={[5, 10, 20]}
        slots={{
          loadingOverlay: LinearProgress,
        }}
        onRowClick={handleRowClick}
        rowSelection={false}
        getRowClassName={(params) =>
          params.row.isBlocked ? "blocked-row" : ""
        }
      />
    </Container>
  );
};

type ModalProps = {
  name: string;
  open: boolean;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const BlockModal = ({
  name,
  open,
  onClose,
  onConfirm,
  isLoading,
}: ModalProps) => {
  const { t } = useTranslation();
  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <DialogTitle>{t("client.block.title")}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t("client.block.confirmation", { name })}
        </DialogContentText>
      </DialogContent>
      <DialogActions
        sx={{ display: "flex", px: 2, justifyContent: "space-between" }}
      >
        <Button onClick={onClose} variant="text" color="primary">
          {t("client.block.cancel")}
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          autoFocus
          disabled={isLoading}
        >
          {isLoading ? (
            <CircularProgress size={24} />
          ) : (
            t("client.block.confirm")
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const UnblockModal = ({
  name,
  open,
  onClose,
  onConfirm,
  isLoading,
}: ModalProps) => {
  const { t } = useTranslation();
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t("client.unblock.title")}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t("client.unblock.confirmation", { name })}
        </DialogContentText>
      </DialogContent>
      <DialogActions
        sx={{ display: "flex", px: 2, justifyContent: "space-between" }}
      >
        <Button onClick={onClose} color="primary">
          {t("client.unblock.cancel")}
        </Button>
        <Button
          onClick={onConfirm}
          color="primary"
          autoFocus
          variant="contained"
          disabled={isLoading}
        >
          {isLoading ? (
            <CircularProgress size={24} />
          ) : (
            t("client.unblock.confirm")
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
