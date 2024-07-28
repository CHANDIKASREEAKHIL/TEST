import React from "react";
import Styles from "./dynamicForm.module.css";
import { useState } from "react";

const DynamicForm = ({
  inputKeys = [],
  labels = {},
  inputTypes = {},
  values = {},
  displayValues = {},
  onChangeHandlers = {},
  disabled = false,
  placeholders = {},
  columns = 2,
  inputWidth = 50,
  validationRules = {}, 
  borderColour,
}) => {
  const [passwordVisibility, setPasswordVisibility] = useState({});

  const getInitialValue = (key) => {
    return displayValues[key] !== undefined ? displayValues[key] : values[key];
  };

  const togglePasswordVisibility = (key) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const getDateAttributes = (rules) => {
    const currentDate = new Date().toISOString().split("T")[0];
    let minDate = null;
    let maxDate = null;

    if (rules) {
      if (rules.noPastDates) {
        minDate = currentDate;
      }
      if (rules.noFutureDates) {
        maxDate = currentDate;
      }
    }
    return { minDate, maxDate };
  };

  const gridTemplateColumns = Array(columns).fill("1fr").join(" ");

  return (
    <div
      className={Styles.labelInputContainer}
      style={{
        gridTemplateColumns: columns === 2 ? "" : gridTemplateColumns,
        paddingRight: inputWidth === 50 ? "" : "0vh",
      }}
    >
      {inputKeys.map((key, index) => {
        const label = labels[key];
        const inputType = inputTypes[key];
        const value = getInitialValue(key);
        const onChange = onChangeHandlers[key];
        const placeholder = placeholders[key] || "";
        const isTextDisabled = inputType === "textDisabled";
        const validationRule = validationRules[key];

        const { minDate, maxDate } = getDateAttributes(validationRule);

        return (
          <div key={index}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                margin: "0.5vh 1.5vh",
              }}
            >
              {label}
            </label>
              <>
                  <input
                    style={{
                      border: borderColour,
                      backgroundColor:
                        (isTextDisabled && disabled) || disabled
                          ? "#e6e6e6"
                          : isTextDisabled
                          ? "#f2f2f2"
                          : "#ffffff",
                    }}
                    type={
                      isTextDisabled
                        ? "text"
                        : passwordVisibility[key]
                        ? "text"
                        : inputType
                    }
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    disabled={disabled || isTextDisabled}
                    min={inputType === "date" ? minDate : undefined}
                    max={inputType === "date" ? maxDate : undefined}
                    autoComplete={
                      inputType === "email"
                        ? "email"
                        : inputType === "password"
                        ? "new-password"
                        : undefined
                    } 
                  />
                {inputType === "password" && (
                  <span
                    className={Styles.togglePassword}
                    onClick={() => togglePasswordVisibility(key)}>
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: "2.5vh", color:"#633172" }}>
                      {passwordVisibility[key]
                        ? "visibility_off"
                        : "visibility"}
                    </span>
                  </span>
                )}
              </>
          </div>
        );
      })}
    </div>
  );
};

export default DynamicForm;
