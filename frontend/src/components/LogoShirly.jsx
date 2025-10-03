import LogoShirly from "../../assets/logos/Logo-ShirlyRose.png";

export default function Logo({ size = "h-14 w-14" }) {
  return (
    <div className="flex justify-center">
      <img
        src={LogoShirly}
        alt="Logo Shirly Rose"
        className={`${size}`}
      />
    </div>
  );
}