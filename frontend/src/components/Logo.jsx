import LogoImg from "../assets/logos/Logo-ShirlyRose.jpg";

export default function Logo({ size = "h-16 w-16", rounded = true }) {
  return (
    <div className="flex justify-center mb-6">
      <img
        src={LogoImg}
        alt="Logo Shirly Rose"
        className={`${size} object-contain ${rounded ? "rounded-full" : ""} shadow-md`}
      />
    </div>
  );
}
