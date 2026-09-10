import ManagerDetails from "../ManagerComponent/Manager";
import EmptyState from "../AdminComponent/EmptyState";

const FundManager = () => {
  const hasAuction = true;
  return (
    <>
      {hasManagers ? (
        <div>
          <ManagerDetails />
        </div>
      ) : (
        <EmptyState message="No Admin Found" />
      )}
    </>
  );
};

export default FundManager;