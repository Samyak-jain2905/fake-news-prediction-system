import { EventEmitter } from "eventemitter3";
import dispatcher from "../dispatcher.js";

export const ACTIONS = {
  PREDICT_REQUEST: "PREDICT_REQUEST",
  PREDICT_SUCCESS: "PREDICT_SUCCESS",
  PREDICT_FAILURE: "PREDICT_FAILURE",
};

class PredictionStore extends EventEmitter {
  constructor() {
    super();
    this.state = {
      loading: false,
      error: null,
      result: null,
    };
    dispatcher.register(this.handleActions.bind(this));
  }

  getState() {
    return this.state;
  }

  handleActions(action) {
    switch (action.type) {
      case ACTIONS.PREDICT_REQUEST:
        this.state = { loading: true, error: null, result: null };
        this.emit("change");
        break;
      case ACTIONS.PREDICT_SUCCESS:
        this.state = { loading: false, error: null, result: action.payload };
        this.emit("change");
        break;
      case ACTIONS.PREDICT_FAILURE:
        this.state = { loading: false, error: action.error, result: null };
        this.emit("change");
        break;
      default:
        break;
    }
  }
}

export default new PredictionStore();







