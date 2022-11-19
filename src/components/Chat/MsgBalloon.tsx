import styled from "styled-components";

interface MsgBalloonProps extends React.HTMLAttributes<HTMLDivElement> {
  isOwn: boolean;
  bg: string;
}

export const MsgBalloon = ({ isOwn, bg, ...props }: MsgBalloonProps) => {
  const Balloon = styled.div`
    position: relative;
    ${isOwn ? "margin-right: 10px;" : "margin-left: 10px;"}
    background-color: ${bg};
    &:after {
      content: "";
      display: block;
      border-width: 10px 10px 0;
      border-style: solid;
      margin-left: -10px;
      position: absolute;
      bottom: -10px;
      left: 50%;
      ${isOwn ? `
      left: auto;
      right: -8px;
      top: auto;
      bottom: 1px;
      border-width: 5px;
      margin: 0;
      border-color: ${bg} transparent transparent ${bg};
      ` : `
      right: auto;
      left: -8px;
      top: auto;
      bottom: 1px;
      border-width: 5px;
      margin: 0;
      border-color: ${bg} ${bg} transparent transparent;
      `};
    }
  `;
  return <Balloon {...props} />;
}