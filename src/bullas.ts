import { Transfer as TransferEvent } from "../generated/Bullas/Bullas";
import { User, Factory } from "../generated/schema";
import { ZERO_BD, ZERO_BI } from "./helpers";

export function handleTransfer(event: TransferEvent): void {
  let user = User.load(event.params.to);
  if (!user) {
    user = new User(event.params.to);
    user.oBeroEarned = ZERO_BD;
    user.queueBalance = ZERO_BD;
  }
  user.save();

  let factory = Factory.load(event.params.tokenId.toString());
  if (!factory) {
    factory = new Factory(event.params.tokenId.toString());
    factory.account = event.params.to;
    factory.moolaPerSecond = ZERO_BD;
    factory.moolaProducedByFactory = ZERO_BD;
    factory.moolaSpentOnFactory = ZERO_BD;
    factory.spanks = ZERO_BI;
    factory.moolaProducedBySpanking = ZERO_BD;
    factory.beraSpentOnSpanking = ZERO_BD;
  }
  factory.account = event.params.to;

  factory.save();
}
