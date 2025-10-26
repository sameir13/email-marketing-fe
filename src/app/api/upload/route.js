import { NextResponse } from 'next/server';
import { Readable } from 'stream';
import csv from 'csv-parser';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const listName = formData.get('listName');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (!listName) {
      return NextResponse.json({ error: 'List name is required' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const stream = Readable.from(buffer);

    const results = [];
    const expectedKeys = [
      "email",
      "firstName",
      "lastName",
      "gender",
      "location",
      "birthday"
    ];

    await new Promise((resolve, reject) => {
      stream
        .pipe(csv())
        .on('data', (row) => {
          const cleanedRow = {};
          for (const [key, value] of Object.entries(row)) {
            cleanedRow[key.trim()] = typeof value === 'string' ? value.trim() : value;
          }

          const rowKeys = Object.keys(cleanedRow);

          // 1. Key count
          if (rowKeys.length !== expectedKeys.length) {
            return reject(
              NextResponse.json(
                { error: "Invalid number of columns in CSV row" },
                { status: 400 }
              )
            );
          }

          // 2. Key order
          for (let i = 0; i < expectedKeys.length; i++) {
            if (rowKeys[i] !== expectedKeys[i]) {
              return reject(
                NextResponse.json(
                  { error: `Invalid column order. Expected "${expectedKeys[i]}" at position ${i + 1}` },
                  { status: 400 }
                )
              );
            }
          }

          // 3. Required email
          if (!cleanedRow.email) {
            return reject(
              NextResponse.json(
                { error: "Email is required in every row" },
                { status: 400 }
              )
            );
          }

          results.push({
            ...cleanedRow,
            listName
          });
        })
        .on('end', () => resolve())
        .on('error', (error) => {
          reject(
            NextResponse.json(
              { error: 'CSV parsing error', details: error.message },
              { status: 400 }
            )
          );
        });
    });

    return NextResponse.json({
      success: true,
      data: results,
    });
  } catch (error) {
    // if error is already a NextResponse, return it
    if (error instanceof Response) {
      return error;
    }

    return NextResponse.json(
      { error: 'Unexpected error', details: error.message },
      { status: 500 }
    );
  }
}
