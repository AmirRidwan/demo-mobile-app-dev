class FnbItem {
  final String id;
  final String name;
  final double price;
  final String image;
  final String description;
  final String category;

  FnbItem({
    required this.id,
    required this.name,
    required this.price,
    required this.image,
    required this.description,
    required this.category,
  });

  factory FnbItem.fromJson(Map<String, dynamic> json) => FnbItem(
    id: json['id'],
    name: json['name'],
    price: (json['price'] as num).toDouble(),
    image: json['image'] ?? "",
    description: json['description'] ?? "",
    category: json['category'] ?? "",
  );
}
