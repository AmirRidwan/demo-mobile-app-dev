export const formatPaymentData = (paymentDetails) => {
    return {
        cardNumber: paymentDetails.cardNumber.replace(/\s+/g, ''),
        cvv: paymentDetails.cvv,
        expirationDate: paymentDetails.expirationDate,
        cardHolderName: paymentDetails.cardHolderName,
    };
};

export const isPaymentDataValid = (paymentDetails) => {
    const { cardNumber, cvv, expirationDate } = paymentDetails;
    return (
        isValidCardNumber(cardNumber) &&
        isValidCVV(cvv) &&
        isValidExpirationDate(expirationDate)
    );
};

const isValidCardNumber = (number) => {
    const regex = /^[0-9]{16}$/;
    return regex.test(number);
};

const isValidCVV = (cvv) => {
    const regex = /^[0-9]{3,4}$/;
    return regex.test(cvv);
};

const isValidExpirationDate = (date) => {
    const [month, year] = date.split('/');
    const currentDate = new Date();
    const expirationDate = new Date(`20${year}`, month - 1);
    return expirationDate > currentDate;
};