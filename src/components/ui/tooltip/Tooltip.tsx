import { Tooltip as TooltipReact } from 'radix-ui'
import './tooltip.css'

const Tooltip = (props) => {
  return (
    <TooltipReact.Provider>
      <TooltipReact.Root delayDuration={0}>
        <TooltipReact.Trigger asChild>
          <div className="TooltipTrigger">{props.trigger}</div>
        </TooltipReact.Trigger>
        <TooltipReact.Portal>
          <TooltipReact.Content className="TooltipContent" sideOffset={5}>
            {props.content}
            <TooltipReact.Arrow className="TooltipArrow" />
          </TooltipReact.Content>
        </TooltipReact.Portal>
      </TooltipReact.Root>
    </TooltipReact.Provider>
  )
}

export default Tooltip
