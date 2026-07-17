import { useState, useEffect } from "react";

export const useDoctorFilters = () => {
  const [page, setPage] = useState(1);
  const [inputName, setInputName] = useState("");
  const [inputEmail, setInputEmail] = useState("");
  const [inputSpecialty, setInputSpecialty] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [specialty, setSpecialty] = useState("");
  const limit = 10;

  useEffect(() => {
    const handlerDebounce = setTimeout(() => {
      setPage(1);
      setName(inputName);
      setEmail(inputEmail);
      setSpecialty(inputSpecialty);
    }, 800);
    return () => clearTimeout(handlerDebounce);
  }, [inputName, inputEmail, inputSpecialty]);

  const handleCleanFilters = () => {
    setInputName("");
    setInputEmail("");
    setInputSpecialty("");
    setName("");
    setEmail("");
    setSpecialty("");
    setPage(1);
  };

  const handleNameFilter = (value: string) => setInputName(value);
  const handleEmailFilter = (value: string) => setInputEmail(value);
  const handleSpecialtyFilter = (value: string) => setInputSpecialty(value);
  const handlePageChange = (newPage: number) => setPage(newPage);

  return {
    inputName,
    inputEmail,
    inputSpecialty,
    name,
    email,
    specialty,
    page,
    setPage,
    limit,
    handleCleanFilters,
    handlePageChange,
    handleNameFilter,
    handleEmailFilter,
    handleSpecialtyFilter,
  };
};
