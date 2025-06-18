import {
  useQuery,
  keepPreviousData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import api from "../api";
import { useState, Fragment, useRef } from "react";
import { IconButton } from "../components/button/button";
import { Icon } from "../components/icon/icon";
import { List, ListItem } from "../components/lists/list";
import { Divider } from "../components/divider/divider";
import { Fab } from "../components/fab/fab";
import { Dialog } from "../components/dialog/dialog";
import { TextButton } from "../components/button/button";
import { OutlinedTextField } from "../components/textfield/textfield";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { MdDialog } from "@material/web/dialog/dialog";
import { useField } from "formik";
import { Checkbox } from "../components/checkbox/checkbox";

const FormikOutlinedTextField = ({ label, ...props }: any) => {
  const [field, meta] = useField(props);
  return (
    <div className="flex flex-col gap-1">
      <OutlinedTextField
        label={label}
        {...field}
        error={meta.touched && meta.error}
        errorText={meta.touched && meta.error ? meta.error : null}
        {...props}
      />
    </div>
  );
};

const createTeamValidationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  designation: Yup.string().required("Designation is required"),
});

const updateTeamValidationSchema = Yup.object({
  _id: Yup.string().required("Team ID is required"),
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  designation: Yup.string().required("Designation is required"),
});

function Teams() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [selectedTeams, setSelectedTeams] = useState<Set<string>>(new Set());
  const { status, data: teams } = useQuery({
    queryKey: ["/teams", page],
    queryFn: async () => {
      const data = await api.get("/teams", {
        params: { page, limit: 10 },
      });
      return data.data;
    },
    placeholderData: keepPreviousData,
    staleTime: 5000,
  });

  const createTeamMutation = useMutation({
    mutationFn: async (newTeam: typeof initialValues) => {
      const response = await api.post("/teams", newTeam);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/teams"] });
      closeCreateDialog();
    },
    onError: (error: any) => {
      console.error("Failed to create team", error);
    },
  });

  const updateTeamMutation = useMutation({
    mutationFn: async (updatedTeam: ITeam) => {
      const response = await api.put(`/teams/${updatedTeam._id}`, updatedTeam);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/teams"] });
      closeUpdateDialog();
    },
    onError: (error: any) => {
      console.error("Failed to update team", error);
    },
  });

  const deleteTeamMutation = useMutation({
    mutationFn: async (teamId: string) => {
      const response = await api.delete(`/teams/${teamId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/teams"] });
      setSelectedTeams(new Set());
    },
    onError: (error: any) => {
      console.error("Failed to delete team", error);
    },
  });

  const handlePrevButton = () => {
    setPage((old) => Math.max(old - 1, 1));
  };
  const handleNextButton = () => {
    setPage((old) => (teams?.hasMore ? old + 1 : old));
  };

  const createTeamDialogRef = useRef<MdDialog>(null);
  const updateTeamDialogRef = useRef<MdDialog>(null);
  const initialValues = {
    name: "",
    email: "",
    designation: "",
  };

  const handleSubmit = (values: typeof initialValues, { resetForm }: any) => {
    console.log("Form submitted:", values);
    createTeamMutation.mutate(values);
    resetForm();
  };

  const handleUpdateSubmit = (values: ITeam, { resetForm }: any) => {
    console.log("Update form submitted:", values);
    updateTeamMutation.mutate(values);
    resetForm();
  };

  const openCreateDialog = () => {
    createTeamDialogRef.current?.show();
  };

  const closeCreateDialog = () => {
    createTeamDialogRef.current?.close();
  };

  const openUpdateDialog = () => {
    updateTeamDialogRef.current?.show();
  };

  const closeUpdateDialog = () => {
    updateTeamDialogRef.current?.close();
  };

  const handleTeamSelect = (id: string) => {
    setSelectedTeams((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      return newSelected;
    });
  };

  const selectedTeam = teams?.data.find((team: ITeam) =>
    selectedTeams.has(team._id),
  );

  return (
    <div className="flex flex-col gap-4">
      <Dialog ref={createTeamDialogRef}>
        <div slot="headline">Add</div>
        <Formik
          initialValues={initialValues}
          validationSchema={createTeamValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleSubmit }) => (
            <>
              <Form slot="content" className="flex flex-col gap-4">
                <FormikOutlinedTextField
                  label="Name"
                  name="name"
                  required
                  autoFocus
                />
                <FormikOutlinedTextField label="Email" name="email" required />
                <FormikOutlinedTextField
                  label="Designation"
                  name="designation"
                  required
                />
              </Form>

              <div slot="actions" className="mt-4 flex justify-end gap-2">
                <TextButton onClick={closeCreateDialog} value="cancel">
                  Cancel
                </TextButton>
                <TextButton onClick={() => handleSubmit()} value="ok">
                  Ok
                </TextButton>
              </div>
            </>
          )}
        </Formik>
      </Dialog>

      <Dialog ref={updateTeamDialogRef}>
        <div slot="headline">Update</div>
        <Formik
          initialValues={
            selectedTeam || { _id: "", name: "", email: "", designation: "" }
          }
          enableReinitialize
          validationSchema={updateTeamValidationSchema}
          onSubmit={handleUpdateSubmit}
        >
          {({ handleSubmit }) => (
            <>
              <Form slot="content" className="flex flex-col gap-4">
                <Field name="_id" type="hidden" />
                <FormikOutlinedTextField
                  label="Name"
                  name="name"
                  required
                  autoFocus
                />
                <FormikOutlinedTextField label="Email" name="email" required />
                <FormikOutlinedTextField
                  label="Designation"
                  name="designation"
                  required
                />
              </Form>

              <div slot="actions" className="mt-4 flex justify-end gap-2">
                <TextButton onClick={closeUpdateDialog} value="cancel">
                  Cancel
                </TextButton>
                <TextButton onClick={() => handleSubmit()} value="ok">
                  Ok
                </TextButton>
              </div>
            </>
          )}
        </Formik>
      </Dialog>

      <h1 className="text-display-large">Teams</h1>
      <div className="flex flex-col gap-4">
        <div className="flex flex-row items-center justify-between">
          <Fab label="Add" onClick={openCreateDialog} variant="primary">
            <Icon slot="icon">add</Icon> Create
          </Fab>

          <div className="flex flex-row items-center gap-4">
            <IconButton
              onClick={openUpdateDialog}
              disabled={selectedTeams.size !== 1}
            >
              <Icon>edit</Icon>
            </IconButton>
            <IconButton
              onClick={() => {
                const selectedTeamDetails = teams?.data.filter((team: ITeam) =>
                  selectedTeams.has(team._id),
                );
                console.log("Selected Teams:", selectedTeamDetails);
                selectedTeamDetails.forEach((team: ITeam) => {
                  deleteTeamMutation.mutate(team._id);
                });
              }}
              disabled={selectedTeams.size === 0}
            >
              <Icon>delete</Icon>
            </IconButton>
            <IconButton
              onClick={() => {
                if (selectedTeams.size === teams?.data.length) {
                  setSelectedTeams(new Set());
                } else {
                  setSelectedTeams(
                    teams?.data.reduce((set: Set<string>, team: ITeam) => {
                      set.add(team._id);
                      return set;
                    }, new Set<string>()),
                  );
                }
              }}
            >
              <Icon>select_all</Icon>
            </IconButton>
          </div>
        </div>

        {status === "pending" ? "Loading..." : ""}
        {teams?.data.length > 0 && (
          <List className="rounded-3xl">
            {teams?.data.map((team: ITeam, index: number) => (
              <Fragment key={team._id}>
                <TeamCard
                  {...team}
                  selected={selectedTeams.has(team._id)}
                  onSelect={() => handleTeamSelect(team._id)}
                />
                {index < teams.data.length - 1 && <Divider />}
              </Fragment>
            ))}
          </List>
        )}
      </div>
      <div className="flex flex-row items-center gap-2">
        <IconButton onClick={handlePrevButton} disabled={page === 1}>
          <Icon>chevron_left</Icon>
        </IconButton>
        <div className="text-label-large">
          {page}/{teams?.totalPages}
        </div>
        <IconButton onClick={handleNextButton} disabled={!teams?.hasMore}>
          <Icon>chevron_right</Icon>
        </IconButton>
      </div>
    </div>
  );
}

export interface ITeam {
  _id: string;
  name: string;
  email: string;
  designation: string;
}

export function TeamCard({
  _id,
  name,
  email,
  designation,
  selected,
  onSelect,
}: ITeam & { selected: boolean; onSelect: () => void }) {
  return (
    <ListItem key={_id}>
      <Checkbox
        slot="start"
        checked={selected}
        onChange={onSelect}
        name={`team-${_id}`}
      ></Checkbox>
      <div slot="headline">{name}</div>
      <div slot="supporting-text">{designation}</div>
      <div slot="trailing-supporting-text">{email}</div>
    </ListItem>
  );
}

export default Teams;
