export default function formatHerotag(address?: string): string {
  if (!address) {
    return '';
  }

  return address.endsWith('.elrond') ? `${address.replaceAll('.elrond', '')}` : address;
}
