import { useCallback, type ChangeEvent, type ReactNode } from "react";
import { useGame, usePositions, type Position } from "./game";
import * as Select from "@radix-ui/react-select";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import { SelectItem } from "./components/Select";
import { TextField } from "@radix-ui/themes";
import { cardText } from "./utils/card_util";
import * as Dialog from "@radix-ui/react-dialog";
import { CardSelect } from "./components/CardSelect";

const Footer = () => {
  const { gameState, updateGameState } = useGame();
  const positions = usePositions();
  const onPlayersCountChange = useCallback(
    (v: string) => {
      updateGameState({
        ...gameState,
        setting: {
          ...gameState.setting,
          playersCount: Number.parseInt(v),
        },
      });
    },
    [gameState, updateGameState]
  );

  const onPositionChange = useCallback(
    (v: string) => {
      updateGameState({
        ...gameState,
        setting: {
          ...gameState.setting,
          position: v as Position,
        },
      });
    },
    [gameState, updateGameState]
  );

  const onSbChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      updateGameState({
        ...gameState,
        setting: {
          ...gameState.setting,
          sb: Number.parseInt(event.currentTarget.value || "0"),
        },
      });
    },
    [gameState, updateGameState]
  );

  const onBbChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      updateGameState({
        ...gameState,
        setting: {
          ...gameState.setting,
          bb: Number.parseInt(event.currentTarget.value || "0"),
        },
      });
    },
    [gameState, updateGameState]
  );

  const onAntiChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      updateGameState({
        ...gameState,
        setting: {
          ...gameState.setting,
          anti: Number.parseInt(event.currentTarget.value || "0"),
        },
      });
    },
    [gameState, updateGameState]
  );
  return (
    <div>
      <div className="grid grid-cols-3 gap-1">
        <div className="flex">
          人数:
          <div>
            <Select.Root
              value={`${gameState.setting.playersCount}`}
              onValueChange={onPlayersCountChange}
            >
              <Select.Trigger>
                <div className="flex items-center">
                  <span className="ml-1">
                    {gameState.setting.playersCount}人
                  </span>
                  <ChevronDownIcon />
                </div>
              </Select.Trigger>
              <Select.Content position="popper">
                <Select.ScrollUpButton>
                  <ChevronUpIcon />
                </Select.ScrollUpButton>
                <Select.Viewport>
                  {[2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                    <SelectItem
                      key={n}
                      value={`${n}`}
                      className="cursor-pointer"
                    >
                      {n}人
                    </SelectItem>
                  ))}
                </Select.Viewport>
                <Select.ScrollDownButton>
                  <ChevronDownIcon />
                </Select.ScrollDownButton>
              </Select.Content>
            </Select.Root>
          </div>
        </div>
        <div className="flex">
          ポジション:
          <div>
            <Select.Root
              value={`${gameState.setting.position}`}
              onValueChange={onPositionChange}
            >
              <Select.Trigger className="flex items-center">
                <span className="ml-1">{gameState.setting.position}</span>
                <ChevronDownIcon />
              </Select.Trigger>
              <Select.Content align="center" position="popper">
                <Select.ScrollUpButton>
                  <ChevronUpIcon />
                </Select.ScrollUpButton>
                <Select.Viewport>
                  {positions.map((v) => (
                    <SelectItem
                      key={v}
                      value={v}
                      className="cursor-pointer bg-gray-800 p-2"
                    >
                      {v}
                    </SelectItem>
                  ))}
                </Select.Viewport>
                <Select.ScrollDownButton>
                  <ChevronDownIcon />
                </Select.ScrollDownButton>
              </Select.Content>
            </Select.Root>
          </div>
        </div>
        <div className="flex">
          手札:
          <div>
            <Dialog.Root>
              <Dialog.Trigger asChild>
                <button type="button">未選択</button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay />
                <Dialog.Content>
                  <Dialog.Title>手札を選択</Dialog.Title>
                  <Dialog.Description>手札を選択</Dialog.Description>
                  <div>
                    <CardSelect
                      count={2}
                      onSelect={(card) => {
                        console.log(cardText(card));
                      }}
                    />
                  </div>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 mt-2">
        <div className="flex">
          SB:
          <div className="ml-2 max-w-1">
            <TextField.Root
              size="1"
              min={0}
              value={`${gameState.setting.sb}`.replace(/^0+/, "") || "0"}
              onChange={onSbChange}
            />
          </div>
        </div>
        <div className="flex">
          BB:
          <div className="ml-2">
            <TextField.Root
              size="1"
              min={0}
              value={`${gameState.setting.bb}`.replace(/^0+/, "") || "0"}
              type="number"
              onChange={onBbChange}
            />
          </div>
        </div>
        <div className="flex">
          Anti:
          <div className="ml-2">
            <TextField.Root
              color="red"
              size="1"
              min={0}
              value={`${gameState.setting.anti}`.replace(/^0+/, "") || "0"}
              type="number"
              onChange={onAntiChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export const GameSettings = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative w-full h-full">
      {children}

      <div className="fixed bottom-0 w-full">
        <hr className="w-full" />
        <div className="p-2">
          <Footer />
        </div>
      </div>
    </div>
  );
};
