import { useState, useEffect } from "react";

export const useAppointmentsFilters = () => {

    const [patientFilter, setPatientFilter] = useState("");
    const [patientInput, setPatientInput] = useState("");
    const [dateFilter, setDateFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [page, setPage] = useState(1);
    const limit = 10;



    useEffect(() => {
        const handlerDebounce = setTimeout(() => {
            setPatientFilter(patientInput);
            setPage(1);
        }, 800)
        return () => clearTimeout(handlerDebounce)

    }, [patientInput])


    const handleDateFilter = (dateFilter: string) => {
        setDateFilter(dateFilter);
        setPage(1);
    }

    const handleStatusFilter = (statusFilter: string) => {
        setStatusFilter(statusFilter);
        setPage(1);
    }

    const handleCleanFilters = () => {
        setPatientFilter("");
        setPatientInput("");
        setDateFilter("");
        setStatusFilter("");
        setPage(1);
    }

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    }

    return {
        patientFilter,
        patientInput,
        setPatientInput,
        dateFilter,
        statusFilter,
        page,
        limit,
        handleDateFilter,
        handleStatusFilter,
        handleCleanFilters,
        handlePageChange
    }
}