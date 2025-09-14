class Review {
  final String author;
  final String content;
  final int stars;

  Review({
    required this.author,
    required this.content,
    required this.stars,
  });

  factory Review.fromJson(Map<String, dynamic> json) => Review(
    author: json['author'],
    content: json['content'],
    stars: json['stars'],
  );
}