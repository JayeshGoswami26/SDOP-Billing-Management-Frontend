/* eslint-disable @typescript-eslint/no-explicit-any */
import DataTable from "../../tables/Table/DataTable";
import { motion } from "framer-motion";
// import LeaveAllowance from "../../EmployeeProfile/LeaveAllowance";
import TableHeader from "./TableHeader";
import { useEffect, useState } from "react";
// import AddressPopup from "../../EmployeeProfile/ProfileAddress/AddressPopup";

interface TableWrapperProps<T> {
  title?: string | React.ReactNode;
  actionButton?: React.ReactNode;
  showBorder?: boolean;
  showShadow?: boolean;
  padding?: string;
  animate?: boolean;
  columns?: any[];
  data?: T[];
  loading?: boolean;
  getRowKey?: (row: T) => string;
  onRowClick?: (row: T) => void;
  children?: React.ReactNode;
  isLeaveAllowance?: boolean | undefined | React.ReactNode;
  isButton?: boolean;
  onClick?: () => void;
  id?: string;
}

function TableWrapper<T extends object>({
  title,
  actionButton,
  showBorder,
  showShadow,
  padding,
  animate,
  columns,
  data,
  getRowKey,
  onRowClick,
  children,
  isLeaveAllowance,
  isButton,
  onClick,
  id,
}: TableWrapperProps<T>) {
  const handleClick = onClick || (() => {});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="bg-white tablewrapper rounded-3xl shadow-md dark:bg-black dark:border-gray-800 border p-5"
    >
      <div className="min-h-[20rem] flex flex-col gap-4">
        {(title || actionButton) && children && !isLeaveAllowance ? (
          <>
            <TableHeader
              title={title || "No Title"}
              actionButton={actionButton}
              showBorder={false}
              showShadow={false}
              padding="none"
              animate={false}
              isButton={isButton}
              onClick={handleClick}
            />

            {loading ? (
              <div className="w-full h-40 rounded-lg bg-gray-200 animate-pulse"></div>
            ) : (
              <div className="flex    flex-col gap-2 w-full overflow-x-auto">
                {children}
              </div>
            )}
          </>
        ) : (
          columns &&
          data &&
          getRowKey && (
            <>
              <TableHeader
                title={title || "No Title"}
                actionButton={actionButton}
                showBorder={false}
                showShadow={false}
                padding="none"
                animate={false}
                onClick={handleClick}
              />
              <div className="w-full overflow-x-auto">
                <DataTable
                  columns={columns}
                  data={data}
                  loading={loading}
                  getRowKey={getRowKey}
                  onRowClick={onRowClick}
                />
              </div>
            </>
          )
        )}

        {/* {isLeaveAllowance && (
          <>
            <LeaveAllowance
              title="Leave Allowance"
              showBorder={false}
              showShadow={false}
              padding="none"
              animate={false}
            >
              <TableHeader
                id={id}
                title="Leave Allowance"
                showBorder={false}
                showShadow={false}
                padding="none"
                animate={false}
                onClick={handleClick}
              />
              <div className="flex  gap-2 w-full overflow-x-auto">
                {children}
              </div>
            </LeaveAllowance>
          </>
        )} */}

        {/*
        // Example usage for AddressPopup if you want to show it for 'address' tab
      
        */}
        {/* {id === "address" && false && (
          <AddressPopup
            onClose={() => {}}
            modalData={{ type: "Permanent Address", address: "" }}
            isOpen={false}
          />
        )} */}
      </div>
    </motion.div>
  );
}

export default TableWrapper;
