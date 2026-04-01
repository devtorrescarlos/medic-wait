import { useState } from "react";


export const useSlotsFilters = () => {

    const [page, setPage] = useState(1);
    const [dayFilter, setDayFilter] = useState("");
    const [dateFilter, setDateFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const limit = 10;


    const handleDayFilterChange = (value: string) => {
        setDayFilter(value);
        setPage(1);
    };

    const handleDateFilterChange = (value: string) => {
        setDateFilter(value);
        setPage(1);
    };

    const handleCleanFilters = () => {
        setStatusFilter("");
        setDateFilter("");
        setDayFilter("");
        setPage(1);
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage)
    }

    const handleStatusFilterChange = (value: string) => {
        setStatusFilter(value);
        setPage(1);
    };

    return {
        page,
        statusFilter,
        dayFilter,
        dateFilter,
        limit,
        handleDayFilterChange,
        handleDateFilterChange,
        handleCleanFilters,
        handlePageChange,
        handleStatusFilterChange
    }
}