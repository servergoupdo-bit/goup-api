    });
  } catch (err) {

    // 🧠 TRACE ERROR SAFE (no rompe runtime)
    try {
      console.error(
        traceStep(trace, "runtime.error", {
          message: err?.message || "unknown_error"
        })
      );
    } catch (e) {
      console.error("[TRACE FAIL]", e.message);
    }

    return res.status(500).json({
      ok: false,
      trace: trace || null,
      error: "runtime_error",
      message: err?.message || "unknown_error"
    });
  }
});
