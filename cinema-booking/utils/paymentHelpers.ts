interface PaymentDetails {
    cardNumber: string;
    cvv: string;
    expirationDate: string;
    cardHolderName: string;
}

export const formatPaymentData = (paymentDetails: PaymentDetails): PaymentDetails => {
    return {
        cardNumber: paymentDetails.cardNumber.replace(/\s+/g, ''),
        cvv: paymentDetails.cvv,
        expirationDate: paymentDetails.expirationDate,
        cardHolderName: paymentDetails.cardHolderName,
    };
};

export const isPaymentDataValid = (paymentDetails: PaymentDetails): boolean => {
    const { cardNumber, cvv, expirationDate } = paymentDetails;
    return (
        isValidCardNumber(cardNumber) &&
        isValidCVV(cvv) &&
        isValidExpirationDate(expirationDate)
    );
};

export const isValidCardNumber = (number: string): boolean => {
    const regex = /^[0-9]{16}$/;
    return regex.test(number);
};

export const isValidCVV = (cvv: string): boolean => {
    const regex = /^[0-9]{3,4}$/;
    return regex.test(cvv);
};

export const isValidExpirationDate = (date: string): boolean => {
    const [month, year] = date.split('/');
    const currentDate = new Date();
    const expirationDate = new Date(`20${year}`, month - 1);
    return expirationDate > currentDate;
};