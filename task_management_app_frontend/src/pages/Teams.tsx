import { useQuery, keepPreviousData } from "@tanstack/react-query";
import api from "../api";
import { useState, Fragment } from "react";
import { IconButton } from "../components/button/button";
import { Icon } from "../components/icon/icon";
import { List, ListItem } from "../components/lists/list";
import { Divider } from "../components/divider/divider";

function Teams() {
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

  const handlePrevButton = () => {
    setPage((old) => Math.max(old - 1, 1));
  };
  const handleNextButton = () => {
    setPage((old) => (teams?.hasMore ? old + 1 : old));
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-display-large">Teams</h1>
      <div className="flex flex-col gap-4">
        {status === "pending" ? "Loading..." : ""}
        <List className="rounded-3xl">
          {teams?.data.map((team: ITeam, index: number) => (
            <Fragment key={team._id}>
              <TeamCard {...team} />
              {index < teams.data.length - 1 && <Divider />}
            </Fragment>
          ))}
        </List>
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
