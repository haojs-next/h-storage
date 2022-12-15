import "./proxy";
import { nextTick } from "./nextTick";

nextTick(function () {
    console.log("nextTick", this)
})
