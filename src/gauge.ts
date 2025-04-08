import { Address, BigDecimal } from "@graphprotocol/graph-ts";
import {
  Gauge__Deposited as Gauge__DepositedEvent,
  Gauge__RewardNotified as Gauge__RewardNotifiedEvent,
  Gauge__RewardPaid as Gauge__RewardPaidEvent,
  Gauge__Withdrawn as Gauge__WithdrawnEvent,
} from "../generated/Gauge/Gauge";
import { Plugin, User } from "../generated/schema";
import {
  INTIIAL_SPANK_PRICE,
  PLUGIN_ADDRESS,
  ZERO_BD,
  convertEthToDecimal,
} from "./helpers";

export function handleGauge__Deposited(event: Gauge__DepositedEvent): void {
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
  plugin.beraEarnedForTreasury = plugin.beraEarnedForTreasury.plus(
    plugin.spankPrice.times(BigDecimal.fromString("0.12"))
  );
  plugin.beraEarnedForDeveloper = plugin.beraEarnedForDeveloper.plus(
    plugin.spankPrice.times(BigDecimal.fromString("0.08"))
  );
  plugin.beraEarnedForBribes = plugin.beraEarnedForBribes.plus(
    plugin.spankPrice.times(BigDecimal.fromString("0.8"))
  );
  plugin.totalQueueBalance = plugin.totalQueueBalance.plus(
    convertEthToDecimal(event.params.amount)
  );

  plugin.save();

  let user = User.load(event.params.user);
  if (!user) {
    user = new User(event.params.user);
    user.oBeroEarned = ZERO_BD;
    user.queueBalance = ZERO_BD;
  }
  user.queueBalance = user.queueBalance.plus(
    convertEthToDecimal(event.params.amount)
  );
  user.save();
}

export function handleGauge__RewardNotified(
  event: Gauge__RewardNotifiedEvent
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
  plugin.oBeroDistributedToSpankers = plugin.oBeroDistributedToSpankers.plus(
    convertEthToDecimal(event.params.reward)
  );

  plugin.save();
}

export function handleGauge__RewardPaid(event: Gauge__RewardPaidEvent): void {
  let user = User.load(event.params.user);
  if (!user) {
    user = new User(event.params.user);
    user.oBeroEarned = ZERO_BD;
    user.queueBalance = ZERO_BD;
  }
  user.oBeroEarned = user.oBeroEarned.plus(
    convertEthToDecimal(event.params.reward)
  );
  user.save();
}

export function handleGauge__Withdrawn(event: Gauge__WithdrawnEvent): void {
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
  plugin.totalQueueBalance = plugin.totalQueueBalance.minus(
    convertEthToDecimal(event.params.amount)
  );

  plugin.save();

  let user = User.load(event.params.user);
  if (!user) {
    user = new User(event.params.user);
    user.oBeroEarned = ZERO_BD;
    user.queueBalance = ZERO_BD;
  }
  user.queueBalance = user.queueBalance.minus(
    convertEthToDecimal(event.params.amount)
  );
  user.save();
}
