import { Button, Input } from "antd";
import { memo, useCallback, useState } from "react";
import type { InputProps } from "antd/es/input";

type InputType = { [key: string]: any };

const Inputs = memo(
  ({
    className,
    type,
    value,
    error = "",
    required = false,
    buttonType = undefined,
    onChange,
    style,
    ...rest
  }: InputType) => {
    const [passwordState, setPasswordState] = useState("password");

    const commonProps: InputProps = {
      className: `${rest?.className}`,
      style: error ? { border: "1px solid red" } : {},
      value,
      defaultValue: rest?.defaultValue,
      autoComplete: rest?.name,
      onChange: (e) => onChange(e.target?.value, rest.name),
      disabled: rest?.disabled,
      placeholder: rest?.placeholder ? rest?.placeholder : rest?.label ? rest?.label : "",
      ...rest,
    };

    const pwToggle = useCallback(() => {
      setPasswordState((prev) => (prev === "password" ? "text" : "password"));
      const myTimeout = setTimeout(pwToggle, 3000);
      passwordState === "password" && clearTimeout(myTimeout);
    }, [passwordState]);

    switch (type) {
      case "text":
      case "email":
      case "password":
        return (
          <div className="form-group field" style={{ ...style }}>
            <Input
              type={type === "password" ? passwordState : type}
              suffix={
                type === "password" ? (
                  <i
                    className={passwordState === "text" ? "fi fi-rr-eye" : "fi fi-rr-eye-crossed"}
                    onClick={(e) => {
                      e.stopPropagation();
                      pwToggle();
                    }}
                  />
                ) : (
                  <></>
                )
              }
              {...commonProps}
            />
            <label className="form-label">
              <i className="form-mandatory" style={{ display: required ? "" : "none" }}>
                *
              </i>
              &nbsp;{rest?.label}
            </label>
            {error ? <p className="form-error">{error}</p> : <>&nbsp;</>}
          </div>
        );
      case "number":
        return (
          <div className="form-group field" style={{ ...style }}>
            <Input
              type="number"
              value={rest?.value}
              className={`${rest?.className} form-field`}
              style={error ? { border: "1px solid red", borderRadius: "5px" } : { borderRadius: "5px" }}
              onKeyDown={(e) => e.key === "e" && e.currentTarget.blur()}
              onWheel={(e) => e.currentTarget.blur()}
              onChange={(e) => onChange(e.target.value, rest?.name)}
              placeholder={rest?.placeholder}
              disabled={rest.disabled}
              defaultValue={rest?.defaultValue ?? ""}
            />
            <label className="form-label">
              <i className="form-mandatory" style={{ display: required ? "" : "none" }}>
                *{" "}
              </i>
              {rest?.label}
            </label>
            {error ? <p className="form-error">{error}</p> : <>&nbsp;</>}
          </div>
        );
      case "button":
        return (
          <Button
            className={rest?.disabled ? "btn-disabled" : rest?.className}
            type={buttonType}
            value={rest?.value}
            style={
              buttonType === "danger"
                ? { ...style, background: "#ff4d4f", color: "white" }
                : { ...style, borderColor: error ? "red" : "" }
            }
            onClick={rest?.onClick}
            disabled={rest?.disabled}
            {...rest}
          >
            {rest?.text ?? "Submit"}
          </Button>
        );
      default:
        break;
    }
  }
);

export default Inputs;
