import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import './SwapForm.css'

interface FormValues {
  amount: number; 
}

type FormProps = {
  setStatus: React.Dispatch<React.SetStateAction<string>>;
  isBuy: boolean; 
};

const SellForm: React.FC<FormProps> = ({ setStatus, isBuy }: FormProps) => {
    const formik = useFormik<FormValues>({
      initialValues: {
        amount: 0,
      },
      validationSchema: Yup.object({
        amount: Yup.number()
          .required("Amount to sell is required")
          .positive("Amount must be positive")
          .max(69000, "Amount to sell cannot exceed 69,000")
          .typeError("Please enter a valid number"),
      }),
      onSubmit: (values, { resetForm }) => {
        const totalValue: string = (values.amount * 1.69).toFixed(2);
        setStatus(
            "Sold " + values.amount + " of token XX at USD$1.69 each!\n" +
            "Overall USD received: " + totalValue 
        );
        resetForm();
      },
      enableReinitialize: true,
    });

  // Due to the lack of time (SORRY AM CURRENTLY STUDYING FOR MIDTERMS)
  // We just assume that there is only an amount field
  // USD value is fixed at USD$1.69
  return (
    <>
      <div className="swap-form-container shared-container-style">
        <h3>Sell Tokens</h3>
        <form onSubmit={formik.handleSubmit}>
          <div className="input-group">
            <label htmlFor="amountToSell">Amount</label>
            <input
              id="amountToSell"
              name="amountToSell"
              type="number"
              value={formik.values.amount}
              onChange={formik.handleChange("amount")}
              onBlur={formik.handleBlur}
              disabled={isBuy}
              className={
                formik.touched.amount && formik.errors.amount && !isBuy 
                  ? "input-error"
                  : ""
              }
            />
            {formik.touched.amount && formik.errors.amount && !isBuy && (
              <div className="error-message">{formik.errors.amount}</div>
            )}
          </div>
          <div className="button-container">
            <button type="submit" className="submit-button" disabled={isBuy}>
              Sell
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default SellForm;
