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
        <EmptyState message="No Manager Found" />
      )}
    </>
  );
};

export default FundManager;