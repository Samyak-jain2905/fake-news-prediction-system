import dispatcher from "../dispatcher.js";
import { ACTIONS } from "../stores/PredictionStore.js";
import { API_BASE_URL } from "../constants/api.js";

export async function predictFakeNews({ title, text }) {
  dispatcher.dispatch({ type: ACTIONS.PREDICT_REQUEST });

  try {
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, text }),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => null);
      throw new Error(errorBody?.detail || "Prediction failed");
    }

    const result = await response.json();
    dispatcher.dispatch({
      type: ACTIONS.PREDICT_SUCCESS,
      payload: result,
    });
  } catch (error) {
    dispatcher.dispatch({
      type: ACTIONS.PREDICT_FAILURE,
      error: error.message,
    });
  }
}







