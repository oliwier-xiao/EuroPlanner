import { AlertResponse, LimitResponse } from "@/types/fun-types";

export function setLimit(limit: number) : LimitResponse {
    if (limit < 0) {
        return {
            success: false,
            message: "Limit nie może być ujemny.",
        };
    }
    return {
        success: true,
        message: "Limit został ustawiony pomyślnie.",
        newLimit: limit,
    };
}

export function updateLimit(spendings: number, newLimit: number) : LimitResponse {
    if (newLimit < 0) {
        return {
            success: false,
            message: "Nowy limit nie może być ujemny.",
        };
    } else if (spendings > newLimit) {
        return {
            success: false,
            message: "Obecne wydatki przekraczają nowy limit.",
        };
    } 
    return { 
        success: true,
        message: "Limit został zaktualizowany.",
        newLimit: newLimit,
    };
}  

export function checkLimitUsage(spendings: number, limit: number) : number {
    if (limit === 0) return 0;
    return Math.round((spendings / limit) * 100);
}

export function limitAlert(alertThreshold: number, limit: number, spending: number) : AlertResponse {
    if (limit === 0) return { alert: false };
    let currentUsage = checkLimitUsage(spending, limit);
    if (alertThreshold >= currentUsage){
        return {
            alert: true,
            message: `Ostrzeżenie: osiągnięto ${currentUsage}% limitu!`,
        };
    }
}
