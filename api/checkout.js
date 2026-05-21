const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
    if (req.method === 'OPTIONS') {
        return res.status(200).json({ method: 'OPTIONS' });
    }

    try {
        const { items } = req.body;

        // Create a Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: items.map(item => ({
                price_data: {
                    currency: 'gbp',
                    product_data: {
                        name: item.name,
                        description: item.desc || 'Magical Streetwear',
                    },
                    unit_amount: item.price * 100, // Stripe uses pence
                },
                quantity: 1,
            })),
            mode: 'payment',
            success_url: 'https://amagical-store.vercel.app/success',
            cancel_url: 'https://amagical-store.vercel.app/cart',
        });

        res.status(200).json({ url: session.url });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
