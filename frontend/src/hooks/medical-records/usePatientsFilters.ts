import { useState, useEffect } from "react";

export const usePatientsFilters = () => {
  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const limit = 10;
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      setNameFilter(nameInput);
      setEmailFilter(emailInput);
    }, 800);
    return () => clearTimeout(timer);
  }, [nameInput, emailInput]);

  const handleCleanFilters = () => {
    setNameInput("");
    setEmailInput("");
    setNameFilter("");
    setEmailFilter("");
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return {
    nameFilter,
    emailFilter,
    nameInput,
    emailInput,
    setNameInput,
    setEmailInput,
    handleCleanFilters,
    handlePageChange,
    limit,
    page,
    setPage,
  };
};
