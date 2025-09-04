import LogoShirly from "../assets/icons/logoSR.png";

export default function Logo({ size = "h-16 w-16" }) {
  return (
    <div className="flex justify-center mb-6">
      <img
        src={LogoShirly}
        alt="Logo Shirly Rose"
        className={`${size}`}
      />
    </div>
  );
}