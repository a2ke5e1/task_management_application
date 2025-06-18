import { Checkbox } from "../checkbox/checkbox";
import { ListItem } from "../lists/list";

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
