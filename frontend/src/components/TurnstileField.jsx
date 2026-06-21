import { Turnstile } from "@marsidev/react-turnstile";
import { TURNSTILE_SITEKEY } from "../api";

const TurnstileField = ({ onVerify, onExpire }) => (
  <div style={{ margin: "8px 0 18px" }}>
    <Turnstile
      siteKey={TURNSTILE_SITEKEY}
      onSuccess={onVerify}
      onExpire={() => onExpire && onExpire()}
      options={{
        theme: "light",
        retry: "auto",
      }}
    />
  </div>
);

export default TurnstileField;
