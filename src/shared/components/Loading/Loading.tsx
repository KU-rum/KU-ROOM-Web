import { BeatLoader, ClipLoader } from "react-spinners";
import styles from "./Loading.module.css";

type LoadingProps =
  | { type?: "full" }
  | { type: "section"; sectionHeight: number };

const MAIN_COLOR = "#009733";

const Loading = (props: LoadingProps) => {
  const isFull = props.type !== "section";
  const height = !isFull ? `${props.sectionHeight}px` : undefined;

  const WrapperClass = isFull ? styles.FullPage : styles.Section;

  const Spinner = isFull ? (
    <ClipLoader color={MAIN_COLOR} size={35} />
  ) : (
    <BeatLoader color={MAIN_COLOR} size={15} margin={4} />
  );

  return (
    <div className={WrapperClass} style={!isFull ? { height } : undefined}>
      {Spinner}
    </div>
  );
};

export default Loading;
