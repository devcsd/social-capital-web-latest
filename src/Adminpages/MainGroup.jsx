import Groups from "../GroupComponent/Groups";
import EmptyState from "../AdminComponent/EmptyState";

const MainGroup = () => {
  const Group = true;
  return (
    <>
      {Group ? (
        <div>
          <Groups />
        </div>
      ) : (
        <EmptyState message="No Groups Found" />
      )}
    </>
  );
};

export default MainGroup;
