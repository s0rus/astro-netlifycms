import { cn } from "@/lib/utils";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type HTMLProps,
  type ReactNode,
} from "react";
import { Icon } from "./icon";

type Sparkle = {
  id: string;
  createdAt: number;
  color: string;
  size: number;
  style: {
    top: string;
    left: string;
  };
};

const DEFAULT_COLOR = "hsl(50deg, 100%, 50%)";
const generateSparkle = (color = DEFAULT_COLOR) => {
  const sparkle = {
    id: String(random(10000, 99999)),
    createdAt: Date.now(),
    color,
    size: random(10, 20),
    style: {
      top: random(0, 100) + "%",
      left: random(0, 100) + "%",
    },
  };
  return sparkle;
};

function SparkleInstance({
  size,
  color,
  style,
}: Pick<Sparkle, "size" | "color" | "style">) {
  return (
    <div
      className="absolute pointer-events-none animate-sparkle-size z-[2]"
      style={style}
    >
      <Icon.sparkle
        width={size}
        height={size}
        fill={color}
        className="animate-sparkle-spin"
      />
    </div>
  );
}

interface SparklesProps extends HTMLProps<HTMLDivElement> {
  children: ReactNode;
}

export function Sparkles({ children, className, ...rest }: SparklesProps) {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  useRandomInterval(
    () => {
      const sparkle = generateSparkle();
      const now = Date.now();
      const nextSparkles = sparkles.filter((sp) => {
        const delta = now - sp.createdAt;
        return delta < 750;
      });
      nextSparkles.push(sparkle);
      setSparkles(nextSparkles);
    },

    50,
    450,
  );

  return (
    <span className="relative inline-block">
      {sparkles.map((sparkle) => (
        <SparkleInstance
          key={sparkle.id}
          size={sparkle.size}
          color={sparkle.color}
          style={sparkle.style}
        />
      ))}
      <strong className={cn("relative z-[1] font-bold text-white", className)}>
        {children}
      </strong>
    </span>
  );
}

const useRandomInterval = (
  callback: () => void,
  minDelay: number,
  maxDelay: number,
) => {
  const timeoutId = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const handleTick = () => {
      const nextTickAt = random(minDelay, maxDelay);
      timeoutId.current = setTimeout(() => {
        savedCallback.current();
        handleTick();
      }, nextTickAt);
    };

    handleTick();

    return () => clearTimeout(timeoutId.current);
  }, [minDelay, maxDelay]);

  const cancel = useCallback(function () {
    clearTimeout(timeoutId.current);
  }, []);

  return cancel;
};

const random = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min)) + min;
};
