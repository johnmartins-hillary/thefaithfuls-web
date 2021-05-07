import axios, { CancelTokenSource } from "axios";
import { Payment, PaymentResponse } from "core/models/Payment";
import { IResponse } from "core/models/Response";
import { Payment as PaymentEnum } from "core/enums/Payment";

const baseUrl = `${process.env.REACT_APP_SERVER_URL}/Payment`;

export const generateReference = async (
  arg: Payment,
  cancelToken: CancelTokenSource
): Promise<IResponse<PaymentResponse>> => {
  try {
    const society = `&societyId=${arg.societyId}`;
    const url = `${baseUrl}/generateReference?paymentGatewayType=${
      arg.paymentGatewayType
    }&organizationId=${arg.organizationId}&amount=${arg.amount}&purpose=${
      arg.purpose
    }&organizationType=${arg.organizationType}${arg.societyId ? society : ""}`;
    const response = await axios.get(url, {
      cancelToken: cancelToken.token,
    });
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const verifyTransaction = async (
  paymentGateWay: PaymentEnum,
  ref: string
): Promise<IResponse<any>> => {
  const url = `${baseUrl}/VerifyTransaction?paymentGatewayType=${paymentGateWay}&referenceCode=${ref}`;
  try {
    const response = await axios.post(url);
    return response.data;
  } catch (err) {
    throw err;
  }
};
export const verifySubTransaction = async (
  paymentGateWay: PaymentEnum,
  ref: string,
  subPlanId: number
): Promise<IResponse<any>> => {
  const url = `${baseUrl}/VerifySubTransaction?paymentGatewayType=${paymentGateWay}&referenceCode=${ref}&subPlanId=${subPlanId}`;
  try {
    const response = await axios.post(url);
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const getDonationTransactions = async ({
  churchId,
  page,
  take,
  cancelToken
}: {
    churchId: string;
    page: number;
    take: number;
    cancelToken: CancelTokenSource
}): Promise<IResponse<any>> => {
  try {
    const url = `${baseUrl}/GetDonationTransactions?churchId=${churchId}&page=${page}&take=${take}`;
    const response = await axios.get(url,{
        cancelToken:cancelToken.token
    });
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const getChurchOnlyDonationTransactions = async ({
  churchId,
  page,
  take,
  cancelToken
}: {
    churchId: string;
    page: number;
    take: number;
    cancelToken?: CancelTokenSource
}): Promise<IResponse<any>> => {
  try {
    const url = `${baseUrl}/GetChurchOnlyDonationTransactions?churchId=${churchId}&page=${page}&take=${take}`;
    const response = await axios.get(url,{
        ...(cancelToken && {cancelToken:cancelToken.token})
    });

    return response.data;
  } catch (err) {
    throw err;
  }
};

export const getSocietyDonationTransactions = async ({
  churchId,
  page,
  take,
  cancelToken
}: {
    churchId: string;
    page: number;
    take: number;
    cancelToken: CancelTokenSource
}): Promise<IResponse<any>> => {
  try {
    const url = `${baseUrl}/GetChurchOnlyDonationTransactions?churchId=${churchId}&page=${page}&take=${take}`;
    const response = await axios.get(url,{
        cancelToken:cancelToken.token
    });
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const withdrawalToChurch = async ({
    amount,
    beneficiary,
    churchBankId,
    churchId,
    currency,
    societyId
}:{
    beneficiary:string;
    churchId:string;
    churchBankId:number;
    amount:number;
    societyId:number;
    currency:"NGN"
}):Promise<IResponse<null>> => {
    try{
        const url = `${baseUrl}/WithdrawalToChurch?beneficiary=${beneficiary}&churchid=${churchId}&churchBankId=${churchBankId}&amount=${amount}&societyId=${societyId}&currency=${currency}`
        const response = await axios.post(url)
        return response.data
    }catch(err){
        throw err
    }
}