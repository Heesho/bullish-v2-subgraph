import { Address, log } from "@graphprotocol/graph-ts";
import {
  Plugin__ClickAdded as Plugin__ClickAddedEvent,
  Plugin__EntryFeeSet as Plugin__EntryFeeSetEvent,
} from "../generated/Plugin/Plugin";
import { Plugin, Factory } from "../generated/schema";
import {
  convertEthToDecimal,
  INTIIAL_SPANK_PRICE,
  ONE_BI,
  PLUGIN_ADDRESS,
  ZERO_BD,
} from "./helpers";

export function handlePlugin__ClickAdded(event: Plugin__ClickAddedEvent): void {
  let spankPrice = INTIIAL_SPANK_PRICE;
  let plugin = Plugin.load(Address.fromString(PLUGIN_ADDRESS));
  if (plugin) {
    spankPrice = plugin.spankPrice;
  }

  let factory = Factory.load(event.params.tokenId.toString());
  if (!factory) {
    log.error("Factory {} not found in Plugin__EntryFeeSet event", [
      event.params.tokenId.toString(),
    ]);
    return;
  }
  factory.spanks = factory.spanks.plus(ONE_BI);
  factory.moolaProducedBySpanking = factory.moolaProducedBySpanking.plus(
    convertEthToDecimal(event.params.mintAmount)
  );
  factory.beraSpentOnSpanking = factory.beraSpentOnSpanking.plus(spankPrice);
  factory.save();
}

export function handlePlugin__EntryFeeSet(
  event: Plugin__EntryFeeSetEvent
): void {
  let plugin = Plugin.load(Address.fromString(PLUGIN_ADDRESS));
  if (!plugin) {
    plugin = new Plugin(Address.fromString(PLUGIN_ADDRESS));
    plugin.spankPrice = INTIIAL_SPANK_PRICE;
    plugin.beraEarnedForTreasury = ZERO_BD;
    plugin.beraEarnedForDeveloper = ZERO_BD;
    plugin.beraEarnedForBribes = ZERO_BD;
    plugin.oBeroDistributedToSpankers = ZERO_BD;
    plugin.totalQueueBalance = ZERO_BD;
  }
  plugin.spankPrice = convertEthToDecimal(event.params.fee);
  plugin.save();
}
