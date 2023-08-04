import { PubNubChannelDestinationEnum, PubNubChannelPrefixEnum, PubNubChannelTypeEnum } from '@kitzen/data-transfer-objects';

class NotificationTool {
  public static getChannelName(prefix: PubNubChannelPrefixEnum, type: PubNubChannelTypeEnum, destination: string | PubNubChannelDestinationEnum): string {
    return `${prefix}.${type}.${destination}`;
  }
}

export default NotificationTool;
