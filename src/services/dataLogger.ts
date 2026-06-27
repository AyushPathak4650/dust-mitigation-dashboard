/**
 * Secure Logging Service
 * Prevents stack trace leakages and screens out sensitive credentials or API keys.
 */
interface ImportMetaEnv {
  readonly VITE_APP_ENV?: string;
  readonly VITE_CECB_API_URL?: string;
  readonly VITE_ENABLE_MOCK_DEMO_DATA?: string;
}

interface ImportMetaWithEnv {
  readonly env: ImportMetaEnv;
}

class DataLogger {
  private isProduction = ((import.meta as unknown) as ImportMetaWithEnv).env.VITE_APP_ENV === 'production';

  log(message: string, context?: Record<string, unknown>) {
    if (this.isProduction) {
      // Production: send sanitized log to audit dashboard service telemetry
      // No console output to prevent credential sniffing
      this.sendToTelemetry('INFO', message, this.sanitize(context));
    } else {
      console.log(`[INFO] ${message}`, context ? this.sanitize(context) : '');
    }
  }

  warn(message: string, context?: Record<string, unknown>) {
    if (this.isProduction) {
      this.sendToTelemetry('WARN', message, this.sanitize(context));
    } else {
      console.warn(`[WARN] ${message}`, context ? this.sanitize(context) : '');
    }
  }

  error(message: string, error?: Error | unknown, context?: Record<string, unknown>) {
    const errorDetails = error instanceof Error ? {
      name: error.name,
      message: error.message, // Do not expose error.stack in production logs
    } : { message: String(error) };

    const payload = {
      ...this.sanitize(context),
      error: errorDetails
    };

    if (this.isProduction) {
      this.sendToTelemetry('ERROR', message, payload);
    } else {
      console.error(`[ERROR] ${message}`, error, payload);
    }
  }

  private sanitize(data?: Record<string, unknown>): Record<string, unknown> {
    if (!data) return {};
    const sensitiveKeys = ['key', 'token', 'password', 'secret', 'auth', 'cookie', 'authorization'];
    const sanitized = { ...data };

    Object.keys(sanitized).forEach(key => {
      const lowerKey = key.toLowerCase();
      if (sensitiveKeys.some(sensitive => lowerKey.includes(sensitive))) {
        sanitized[key] = '[REDACTED_SECURE]';
      } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
        sanitized[key] = this.sanitize(sanitized[key] as Record<string, unknown>);
      }
    });

    return sanitized;
  }

  private sendToTelemetry(level: string, message: string, payload: Record<string, unknown>) {
    // Mock telemetry send: POST /telemetry
    // In production, this pushes to safe centralized logging server
    const endpoint = ((import.meta as unknown) as ImportMetaWithEnv).env.VITE_CECB_API_URL;
    if (endpoint && !((import.meta as unknown) as ImportMetaWithEnv).env.VITE_ENABLE_MOCK_DEMO_DATA) {
      fetch(`${endpoint}/telemetry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ level, message, payload, timestamp: new Date().toISOString() })
      }).catch(() => {
        // Fail-silent in client to prevent UI locking
      });
    }
  }
}

export const logger = new DataLogger();
export default logger;
