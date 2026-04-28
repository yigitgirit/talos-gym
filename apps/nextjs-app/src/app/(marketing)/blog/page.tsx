"use client";

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Calendar, ChevronRight, User} from "lucide-react";
import React from "react";

interface BlogPost {
    id: number;
    title: string;
    excerpt: string;
    author: string;
    date: string;
    category: string;
    readTime: string;
    image?: string;
}

const BLOG_POSTS: BlogPost[] = [
    {
        id: 1,
        title: "5 Science-Backed Tips to Boost Your Workout Performance",
        excerpt:
            "Discover research-proven strategies to maximize your gym sessions and see faster results.",
        author: "Sarah Mitchell",
        date: "April 10, 2026",
        category: "Training",
        readTime: "5 min read",
    },
    {
        id: 2,
        title: "How Community Transforms Fitness Goals Into Reality",
        excerpt:
            "Learn how working out with a community can increase motivation and help you stick to your goals.",
        author: "John Rodriguez",
        date: "April 8, 2026",
        category: "Community",
        readTime: "7 min read",
    },
    {
        id: 3,
        title: "Nutrition Guide for Gym Enthusiasts: Fuel Your Performance",
        excerpt:
            "A comprehensive guide to eating right for your fitness goals, from muscle gain to fat loss.",
        author: "Emma Watson",
        date: "April 5, 2026",
        category: "Nutrition",
        readTime: "8 min read",
    },
    {
        id: 4,
        title: "Recovery Matters: Why Rest Days Are Essential for Gains",
        excerpt:
            "Understanding the science behind recovery and why taking breaks actually helps you progress faster.",
        author: "Mike Johnson",
        date: "April 1, 2026",
        category: "Recovery",
        readTime: "6 min read",
    },
    {
        id: 5,
        title: "Beginner's Guide: Starting Your Fitness Journey",
        excerpt:
            "Everything you need to know when beginning your fitness journey, from choosing a gym to setting realistic goals.",
        author: "Lisa Chen",
        date: "March 28, 2026",
        category: "Beginner",
        readTime: "10 min read",
    },
    {
        id: 6,
        title: "The Psychology of Habit: Building Lasting Fitness Routines",
        excerpt:
            "Learn how to build sustainable fitness habits that stick, even when motivation fades.",
        author: "David Park",
        date: "March 25, 2026",
        category: "Mindset",
        readTime: "9 min read",
    },
];

const CATEGORIES = Array.from(
    new Set(BLOG_POSTS.map((post) => post.category))
);

export default function BlogPage() {
    const [selectedCategory, setSelectedCategory] = React.useState("");
    const [posts, setPosts] = React.useState(BLOG_POSTS);

    React.useEffect(() => {
        if (selectedCategory) {
            setPosts(
                BLOG_POSTS.filter((post) => post.category === selectedCategory)
            );
        } else {
            setPosts(BLOG_POSTS);
        }
    }, [selectedCategory]);

    return (
        <>
            {/* Header Section */}
            <section className="w-full py-12 md:py-16 bg-linear-to-b from-primary/10 to-background">
                <div className="container max-w-7xl mx-auto px-4">
                    <div className="flex flex-col gap-4">
                        <h1 className="font-heading text-4xl md:text-5xl font-bold">
                            Fitness Insights & Tips
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl">
                            Expert advice, training tips, and community stories to fuel your
                            fitness journey.
                        </p>
                    </div>
                </div>
            </section>

            {/* Featured Post */}
            <section className="w-full py-12 md:py-16">
                <div className="container max-w-7xl mx-auto px-4">
                    <Card className="overflow-hidden">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div
                                className="h-64 md:h-full bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center text-muted-foreground">
                                <div className="text-center">
                                    <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50"/>
                                    <p>Featured Image</p>
                                </div>
                            </div>
                            <CardHeader>
                                <div className="flex gap-2 mb-4">
                                    <Badge className="w-fit">Featured</Badge>
                                    <Badge variant="outline">Training</Badge>
                                </div>
                                <CardTitle className="text-2xl mb-4">
                                    {BLOG_POSTS[0].title}
                                </CardTitle>
                                <div className="flex flex-col gap-3 text-sm text-muted-foreground mb-4">
                                    <div className="flex gap-2 items-center">
                                        <User className="w-4 h-4"/>
                                        <span>{BLOG_POSTS[0].author}</span>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <Calendar className="w-4 h-4"/>
                                        <span>
                        {BLOG_POSTS[0].date} • {BLOG_POSTS[0].readTime}
                      </span>
                                    </div>
                                </div>
                                <p className="text-foreground mb-6">{BLOG_POSTS[0].excerpt}</p>
                                <Button className="gap-2 w-fit">
                                    Read Article <ChevronRight className="w-4 h-4"/>
                                </Button>
                            </CardHeader>
                        </div>
                    </Card>
                </div>
            </section>

            {/* Category Filter */}
            <section className="w-full py-8 bg-muted/30">
                <div className="container max-w-7xl mx-auto px-4">
                    <div className="flex flex-wrap gap-2">
                        <Badge
                            variant={selectedCategory === "" ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => setSelectedCategory("")}
                        >
                            All Articles
                        </Badge>
                        {CATEGORIES.map((category) => (
                            <Badge
                                key={category}
                                variant={
                                    selectedCategory === category ? "default" : "outline"
                                }
                                className="cursor-pointer"
                                onClick={() => setSelectedCategory(category)}
                            >
                                {category}
                            </Badge>
                        ))}
                    </div>
                </div>
            </section>

            {/* Blog Posts Grid */}
            <section className="w-full py-12 md:py-16">
                <div className="container max-w-7xl mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-6">
                        {posts.map((post) => (
                            <Card
                                key={post.id}
                                className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
                            >
                                <div
                                    className="h-48 bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center text-muted-foreground">
                                    <Calendar className="w-12 h-12 opacity-30"/>
                                </div>
                                <CardHeader>
                                    <div className="flex gap-2 mb-2">
                                        <Badge variant="secondary">{post.category}</Badge>
                                    </div>
                                    <CardTitle className="text-lg line-clamp-2">
                                        {post.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex-1 flex flex-col gap-4">
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {post.excerpt}
                                    </p>
                                    <div className="flex flex-col gap-2 text-xs text-muted-foreground">
                                        <div className="flex gap-2 items-center">
                                            <User className="w-4 h-4"/>
                                            <span>{post.author}</span>
                                        </div>
                                        <div className="flex gap-2 items-center">
                                            <Calendar className="w-4 h-4"/>
                                            <span>
                          {post.date} • {post.readTime}
                        </span>
                                        </div>
                                    </div>
                                    <Button
                                        variant="outline"
                                        className="w-full gap-2 mt-auto"
                                    >
                                        Read More <ChevronRight className="w-4 h-4"/>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter */}
            <section className="w-full py-16 md:py-24 bg-primary/5">
                <div className="container max-w-7xl mx-auto px-4">
                    <div className="max-w-2xl mx-auto text-center">
                        <h2 className="font-heading text-3xl font-bold mb-4">
                            Subscribe to Our Newsletter
                        </h2>
                        <p className="text-lg text-muted-foreground mb-8">
                            Get weekly tips, articles, and community stories delivered to your inbox.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <input
                                type="email"
                                placeholder="your@email.com"
                                className="flex-1 px-4 py-2 rounded-md border border-input bg-background text-foreground"
                            />
                            <Button>Subscribe</Button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

