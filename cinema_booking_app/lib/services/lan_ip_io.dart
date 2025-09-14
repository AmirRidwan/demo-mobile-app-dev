import 'dart:io';

Future<String?> getLanIp() async {
  try {
    final interfaces = await NetworkInterface.list(
      includeLoopback: false,
      type: InternetAddressType.IPv4,
    );
    for (final interface in interfaces) {
      for (final addr in interface.addresses) {
        if (!addr.isLoopback) {
          return addr.address;
        }
      }
    }
  } catch (e) {
    print("❌ Failed to get LAN IP: $e");
  }
  return null;
}
