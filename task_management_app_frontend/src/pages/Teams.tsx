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
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { MdDialog } from "@material/web/dialog/dialog";
import { useField } from "formik";

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

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  designation: Yup.string().required("Designation is required"),
});

function Teams() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const { status, data: teams } = useQuery({
    queryKey: ["/teams", page],
    queryFn: async () => {
      const data = await api.get("/teams", {
        params: { page, limit: 5 },
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
      closeDialog();
    },
    onError: (error: any) => {
      console.error("Failed to create team", error);
    },
  });

  const handlePrevButton = () => {
    setPage((old) => Math.max(old - 1, 1));
  };
  const handleNextButton = () => {
    setPage((old) => (teams?.hasMore ? old + 1 : old));
  };

  const dialogRef = useRef<MdDialog>(null);
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

  const openDialog = () => {
    dialogRef.current?.show();
  };

  const closeDialog = () => {
    dialogRef.current?.close();
  };

  return (
    <div className="flex flex-col gap-4">
      <Dialog ref={dialogRef}>
        <div slot="headline">Add</div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
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
                <TextButton onClick={closeDialog} value="cancel">
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
        <Fab label="Add" onClick={openDialog} variant="primary">
          <Icon slot="icon">add</Icon> Create
        </Fab>
        {status === "pending" ? "Loading..." : ""}
        {teams?.data.length > 0 && (
          <List className="rounded-3xl">
            {teams?.data.map((team: ITeam, index: number) => (
              <Fragment key={team._id}>
                <TeamCard {...team} />
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

export function TeamCard({ _id, name, email, designation }: ITeam) {
  return (
    <ListItem key={_id}>
      <div slot="headline">{name}</div>
      <div slot="supporting-text">{designation}</div>
      <div slot="trailing-supporting-text">{email}</div>
    </ListItem>
  );
}

export default Teams;
