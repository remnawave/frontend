
import { Badge, Checkbox, Group, Text } from '@mantine/core';
import { IProps } from './interfaces';
import classes from './Checkbox.module.css';

export function InboundCheckboxCardWidget(props: IProps) {
  const { inbound } = props;
  return (
    <Checkbox.Card
    className={classes.root}
    radius="md"    
    value={inbound.uuid}
    key={inbound.uuid}
  >
    <Group wrap="nowrap" align="flex-start">
      <Checkbox.Indicator />
      <div>
        <Text className={classes.label}>{inbound.tag}</Text>
        <Badge variant="outline" size="sm" color="gray">
          {inbound.type}
        </Badge>
          </div>
      </Group>  
    </Checkbox.Card>
  );
}
