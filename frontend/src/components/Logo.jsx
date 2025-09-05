import LogoImg from "../assets/logos/Logo-ShirlyRose.png";

export default function Logo({ size = "h-17 w-16" }) {
  return (
    <div className="flex justify-center mb-6">
      <img
        src={LogoImg}
        alt="Logo Shirly Rose"
        className={`${size}`}
      />
    </div>
  );
}
