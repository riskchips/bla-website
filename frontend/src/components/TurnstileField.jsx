import Turnstile from "react-turnstile";
import { TURNSTILE_SITEKEY } from "../api";

const TurnstileField = ({ onVerify, onExpire }) => (
  <div style={{ margin: "8px 0 18px" }}>
    <Turnstile
      sitekey={TURNSTILE_SITEKEY}
      onVerify={onVerify}
      onExpire={() => onExpire && onExpire()}
      theme="light"
      retry="auto"
    />
  </div>
);

export default TurnstileField;
