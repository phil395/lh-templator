import { type FC } from "react";
import { usePreviewStore } from "../../../store";
import styles from "./VariablesAssigner.module.css";
import { useDebouncedCallback } from "../../../hooks";

interface ItemVariableProps {
  variableName: string;
  updateVariableValue: (variableName: string, newValue: string) => void;
}

const DELAY = 75;

const ItemVariable: FC<ItemVariableProps> = ({
  variableName,
  updateVariableValue,
}) => {
  const update = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateVariableValue(variableName, e.target.value);
  };

  const debouncedUpdate = useDebouncedCallback(update, DELAY);

  return (
    <li className={styles.item}>
      <p>
        {"{"}
        {variableName}
        {"}"}
      </p>
      <input className="text-field" onChange={debouncedUpdate} />
    </li>
  );
};

interface VariablesAssignerProps {
  arrVarNames: string[];
}

export const VariablesAssigner: FC<VariablesAssignerProps> = ({
  arrVarNames,
}) => {
  const updateVariableValue = usePreviewStore(
    ({ updateVariableValue }) => updateVariableValue,
  );

  if (!arrVarNames.length) return <div>Variables are not used</div>;

  return (
    <ul>
      {arrVarNames.map((variableName) => (
        <ItemVariable
          key={variableName}
          variableName={variableName}
          updateVariableValue={updateVariableValue}
        />
      ))}
    </ul>
  );
};
