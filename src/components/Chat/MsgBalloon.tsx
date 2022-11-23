import styled from "styled-components";

interface MsgBalloonProps extends React.HTMLAttributes<HTMLDivElement> {
  isOwn: boolean
}

const balloonMeColor = "#0284c7";
const balloonYouColor = "#374151";

const Balloon = styled.div`
    position: relative;
    ${props => props.className?.split(' ').includes('me') ? "margin-right: 10px;" : "margin-left: 10px;"}
    background-color: ${props => props.className?.split(' ').includes('me') ? balloonMeColor : balloonYouColor};
    &:after {
      content: "";
      display: block;
      border-width: 10px 10px 0;
      border-style: solid;
      margin-left: -10px;
      position: absolute;
      bottom: -10px;
      left: 50%;
      ${props => props.className?.split(' ').includes('me') ? `
      left: auto;
      right: -8px;
      top: auto;
      bottom: 1px;
      border-width: 5px;
      margin: 0;
      border-color: ${balloonMeColor} transparent transparent ${balloonMeColor};
      ` : `
      right: auto;
      left: -8px;
      top: auto;
      bottom: 1px;
      border-width: 5px;
      margin: 0;
      border-color: ${balloonYouColor} ${balloonYouColor} transparent transparent;
      `};
    }
  `;

export const MsgBalloon = ({ isOwn, ...props }: MsgBalloonProps) => {
  return <Balloon {...props} className={`${isOwn ? 'me' : ''} ${props.className}`} />;
}