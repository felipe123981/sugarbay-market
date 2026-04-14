
    import React, { useState } from 'react';
    import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
    import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
    import { Button } from "@/components/ui/button";
    import { Textarea } from "@/components/ui/textarea";
    import { Label } from "@/components/ui/label";
    import { Star, StarHalf } from 'lucide-react';
    import { Progress } from "@/components/ui/progress";
    import { useToast } from "@/components/ui/use-toast";
    import { motion } from 'framer-motion';

    // Placeholder reviews data
    const initialReviews = [
      { id: 1, user: "Alice M.", rating: 5, comment: "Absolutely love this product! Exceeded expectations.", date: "2025-04-28", initials: "AM" },
      { id: 2, user: "Bob K.", rating: 4, comment: "Very good quality, delivery was fast. Minor scratch on arrival but overall happy.", date: "2025-04-25", initials: "BK" },
      { id: 3, user: "Charlie P.", rating: 3, comment: "It's okay. Does the job but feels a bit cheap.", date: "2025-04-20", initials: "CP" },
    ];

    // Helper to display stars
    const StarRating = ({ rating }) => {
      const fullStars = Math.floor(rating);
      const halfStar = rating % 1 !== 0;
      const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

      return (
        <div className="flex items-center">
          {[...Array(fullStars)].map((_, i) => (
            <Star key={`full-${i}`} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
          ))}
          {halfStar && <StarHalf key="half" className="h-4 w-4 text-yellow-400 fill-yellow-400" />}
          {[...Array(emptyStars)].map((_, i) => (
            <Star key={`empty-${i}`} className="h-4 w-4 text-muted-foreground" />
          ))}
        </div>
      );
    };

    // Calculate rating distribution (placeholder)
    const calculateRatingDistribution = (reviews) => {
      const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      let total = 0;
      reviews.forEach(review => {
        if (distribution[review.rating] !== undefined) {
          distribution[review.rating]++;
          total++;
        }
      });
      return Object.entries(distribution)
        .map(([rating, count]) => ({
          rating: parseInt(rating),
          count,
          percentage: total > 0 ? (count / total) * 100 : 0,
        }))
        .sort((a, b) => b.rating - a.rating); // Sort highest rating first
    };


    const Reviews = () => {
      const [reviews, setReviews] = useState(initialReviews);
      const [newReviewText, setNewReviewText] = useState('');
      const [newRating, setNewRating] = useState(0);
      const [hoverRating, setHoverRating] = useState(0);
      const { toast } = useToast();
      // Placeholder - check if user is logged in to allow review submission
      const canSubmitReview = true; // Replace with actual auth check later

      const ratingDistribution = calculateRatingDistribution(reviews);
      const averageRating = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

      const handleSubmitReview = (e) => {
        e.preventDefault();
        if (!newReviewText || newRating === 0) {
          toast({
            title: "Incomplete Review",
            description: "Please provide a rating and comment.",
            variant: "destructive",
          });
          return;
        }
        // Simulate adding review (replace with API call later)
        const newReview = {
          id: Date.now(),
          user: "Current User", // Replace with actual user data
          rating: newRating,
          comment: newReviewText,
          date: new Date().toISOString().split('T')[0],
          initials: "CU" // Replace with actual user initials
        };
        setReviews([newReview, ...reviews]); // Add new review to the top
        setNewReviewText('');
        setNewRating(0);
        toast({
          title: "Review Submitted",
          description: "Thank you for your feedback!",
        });
      };


      return (
        <div className="mt-12 space-y-8">
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <h2 className="text-2xl font-semibold mb-6">Customer Reviews</h2>

              {/* Rating Summary */}
              <Card className="mb-6 glassmorphism">
                <CardContent className="p-6 flex flex-col md:flex-row gap-6 items-start">
                  <div className="flex flex-col items-center md:items-start mb-4 md:mb-0">
                    <p className="text-4xl font-bold">{averageRating.toFixed(1)}</p>
                    <StarRating rating={averageRating} />
                    <p className="text-sm text-muted-foreground mt-1">{reviews.length} reviews</p>
                  </div>
                  <div className="flex-1 w-full">
                    {ratingDistribution.map(({ rating, percentage }) => (
                      <div key={rating} className="flex items-center gap-2 mb-1">
                        <span className="text-sm w-12 text-right">{rating} star</span>
                        <Progress value={percentage} className="h-2 flex-1" />
                        <span className="text-sm text-muted-foreground w-10 text-right">{percentage.toFixed(0)}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
           </motion.div>

           {/* Submit Review Form (conditional) */}
           {canSubmitReview && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              <Card className="glassmorphism">
                <CardHeader>
                  <CardTitle>Write a Review</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <div>
                      <Label>Your Rating</Label>
                       <div className="flex items-center space-x-1 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-6 w-6 cursor-pointer transition-colors ${
                              (hoverRating || newRating) >= star
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-muted-foreground'
                            }`}
                            onClick={() => setNewRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="review-comment">Your Review</Label>
                      <Textarea
                        id="review-comment"
                        placeholder="Share your thoughts about the product..."
                        value={newReviewText}
                        onChange={(e) => setNewReviewText(e.target.value)}
                        required
                        className="bg-background/70"
                      />
                    </div>
                    <Button type="submit">Submit Review</Button>
                  </form>
                </CardContent>
              </Card>
             </motion.div>
           )}

          {/* Display Reviews */}
          <div className="space-y-6">
            {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <Card className="glassmorphism">
                  <CardContent className="p-4 flex gap-4">
                    <Avatar>
                      {/* <AvatarImage src={`/avatars/${review.initials}.png`} /> */}
                      <AvatarFallback>{review.initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold">{review.user}</span>
                        <span className="text-xs text-muted-foreground">{review.date}</span>
                      </div>
                      <StarRating rating={review.rating} />
                      <p className="mt-2 text-sm">{review.comment}</p>
                    </div>
                  </CardContent>
                </Card>
               </motion.div>
            ))}
             {reviews.length === 0 && (
               <p className="text-muted-foreground text-center py-4">No reviews yet. Be the first to review!</p>
             )}
          </div>
        </div>
      );
    };

    export default Reviews;
  