// serial.d.ts
interface Navigator {
  serial: {
    getPorts: () => Promise<SerialPort[]>;
    requestPort: () => Promise<SerialPort>;
  };
}

interface SerialPort {
  open: (options: SerialOptions) => Promise<void>;
  close: () => Promise<void>;
  readable: ReadableStream;
  writable: WritableStream;
  getInfo: () => Promise<SerialPortInfo>;
}

interface SerialOptions {
  baudRate: number;
}

interface SerialPortInfo {
  comPortNumber: string;
  usbVendorId: number;
  usbProductId: number;
  serialNumber: string | null;
}
