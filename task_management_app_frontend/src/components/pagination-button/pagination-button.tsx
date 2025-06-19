import { IconButton } from "../button/button";
import { Icon } from "../icon/icon";

interface IPaginationControlsProps {
  page: number;
  totalPages: number;
  hasMore: boolean;
  handlePrevButton: () => void;
  handleNextButton: () => void;
}

export const PaginationControls = ({
  page,
  totalPages,
  hasMore,
  handlePrevButton,
  handleNextButton,
}: IPaginationControlsProps) => {
  return (
    <>
      {totalPages > 1 && (
        <div className="flex flex-row items-center gap-2">
          <IconButton onClick={handlePrevButton} disabled={page === 1}>
            <Icon>chevron_left</Icon>
          </IconButton>
          <div className="text-label-large">
            {page}/{totalPages}
          </div>
          <IconButton onClick={handleNextButton} disabled={!hasMore}>
            <Icon>chevron_right</Icon>
          </IconButton>
        </div>
      )}
    </>
  );
};
